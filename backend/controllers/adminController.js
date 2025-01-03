import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { PrismaClient as centralPrismaClient } from "../prisma/generated/central/index.js";
const centralprisma = new centralPrismaClient({
    datasources:{
        db:{
            url:process.env.CENTRAL_DB_URL
        }
    }
})
const addHospital = async(req,res)=>{
    console.log(req.body)
    const {name,location,city,state,dbURL,code} = req.body;
    try{
    const hospital = await centralprisma.hospital.create({
        data:{
            code,
            name,
            location,
            city,state,
            dbURL:dbURL,
        }
    })
    res.json({sucess:true,message:"Created",data:hospital})
    }
    catch(err){
        console.log(err)
        res.json({sucess:false,message:err})
    }
}

export const getHospitals=async(req,res)=>{
	try{
		const hospitals=await centralprisma.hospital.findMany({
			include:{
				records:true,
				admin:true,
				patientBooking:true
			}

			
		});

		return res.status(200).json({hospitals});
	}
	catch{
		return res.status(500).json({msg:"error"});
	}
	
}

export const getHosp=async(req,res)=>{
	try{
		const {code}=req.body;
		const hosp=await centralprisma.hospital.findUnique({
			where:{
				code
			}
		})

		return res.status(200).json({hosp});

	}
	catch{
		return res.status(500).json({msg:"error"});
	}
}

const migratealldbs = async(req,res) =>{
    try{
    const hospitalDBURLS = await centralprisma.hospital.findMany({
        select:{
            dbURL:true
        }
    })
    const migrateHospitals = hospitalDBURLS.map((x)=>{
        process.env.DYNAMIC_DB_URL = x.dbURL;
        return new Promise((resolve,reject) =>{
            exec("npx prisma migrate dev --schema=/home/yashwanth-linux/Hospital-SIH/backend/prisma/hospitalschema.prisma",(error,stdout,stderr)=>{
                if(error){
                    console.log("Error in migrating");
                    reject(error);
                }
                console.log("Migration output: "+stdout);
                resolve();
            })
            exec("npx prisma generate --schema=/home/yashwanth-linux/Hospital-SIH/backend/prisma/hospitalschema.prisma",(error,stdout,stderr)=>{
                if(error){
                    console.log("Error in migrating");
                    reject(error);
                }
                console.log("Migration output: "+stdout);
                resolve();
            })
        })
    })
    console.log(migrateHospitals);
    res.json({sucess:true,message:"Proceed"})
    }catch(err){
        res.json({sucess:false,message:err})
    }
}

const getPatientabhaId = async(req,res)=>{
    const abhaId = req.headers.abhaid;
    console.log(abhaId)
    try{
        const patient = await centralprisma.patient.findUnique({
            where:{
                abhaId:abhaId
            },select:{
                abhaId:true,
                name:true,
                DOB:true,gender:true,contact:true,
            }
        })
        console.log(patient)
        const today = new Date();
        const birthDate = new Date(patient.DOB);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        patient.Age = age;
        console.log(age);
        res.json({success:true,patient:patient})
    }catch(err){
        console.log(err);
        res.json({success:true,message:err})
    }
}

const getMedicalRecords = async(req,res)=>{
    try{
        const medicalRecord = await centralprisma.medicalRecord.findMany({
            where:{
                patientId:abhaId
            },select:{
                hospitalName:true,
                recordDate:true,
                visitReason:true,
                medicationsPrescribed:true,
                treatmentSummary:true,
                doctorName:true,
                documents:true
            }
        })
        res.json({sucess:true,records:medicalRecord})
    }catch(err){
        console.log(err)
        res.json({success:false,message:err})
    }
}

const createPatient = async(req,res)=>{
    const {name,contact,address,gender,dob,emergencyContact,email,password} = req.body;
    let abhaid = await centralprisma.aBHANumber.findFirst();
    if(abhaid==null){
        abhaid = "999999999999"
    }else{
        console.log(abhaid);
        abhaid = parseInt(abhaid.prev,10) -1;
        console.log(abhaid);
        abhaid = abhaid.toString();
        console.log(abhaid)
    }
    await centralprisma.aBHANumber.deleteMany()
    await centralprisma.aBHANumber.create({
        data:{
            prev:abhaid
        }
    })
    try{
        if (password.length<8){
            res.json({success:false,message:"password small"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashpass=await bcrypt.hash(password,salt)
        const patient = await centralprisma.patient.create({
            data:{
                abhaId:abhaid,
                name:name,
                contact:contact,
                address:address,
                gender:gender,
                DOB:dob,
                emergencyContact:emergencyContact,
                email:email,
                password:hashpass
            }
        })
	const token=createtoken(patient.abhaId);
        console.log(patient);
        res.json({success:true,abhaid:abhaid,token:`Bearer ${token}`});
    }catch(err){
        console.log(err);
        res.json({success:false,message:err});
    }
}

const adminregister=async(req,res)=>{
    const {name,email,password,hosCode}=req.body
    try{
        if (password.length<8){
            res.json({success:false,message:"password small"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashpass=await bcrypt.hash(password,salt)
        const admin=await centralprisma.admin.create(
            {
                data:{
                    name,
                    email,
                    password:hashpass,
                    hospitalCode:hosCode
                }
            }
        )
        const token = createtoken(admin.hospitalCode)
        console.log(admin)
        res.json({success:true,message:admin,token:token})
    }
    catch (err){
        console.log(err)
        res.json({success:false,message:err})
    }
}

const adminlogin=async(req,res)=>{
        const prisma=req.prisma
        try{
        const {email,password,hosCode}=req.body
        const admin=await centralprisma.admin.findUnique({
            where:{
                email,
                hospitalCode:hosCode
            }
        })   
        if(!admin)
        {
            return res.json({success:false})
        }

        const passVerify=await bcrypt.compare(password,admin.password)
        if(!passVerify){
            res.json({success:false,message:"pass dont match"})
        }
        const token = createtoken(admin.hospitalCode)
        res.json({success:true,token:"Bearer "+token,hosCode:admin.hospitalCode})
        }
    catch(err){
        console.log(err)
        res.json({success:false,message:err})
    }
}


function createtoken(id)
{
    const token=jwt.sign({id},process.env.JWT_SECRET);
    return token
}


export const allocateBed = async(req,res) =>{
    const prisma = req.prisma;
    try{
        
    } catch(e){
        console.log(e);
        res.json({success:false,error:e})
    }
}


export const addOPD = async (req, res) => {
    try {
      const prisma = req.prisma;
      const {
        date,
        day,
        holiday,
        specialEvent,
        noofpatients,
        noofdoctors,
        time,
        ppdh,
        weather,
      } = req.body;
      if (
        !date ||
        !day ||
        typeof holiday !== "boolean" ||
        typeof specialEvent !== "boolean" ||
        !Number.isInteger(noofpatients) ||
        !Number.isInteger(noofdoctors) ||
        typeof time !== "number" ||
        typeof ppdh !== "number" ||
        !weather
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid input data. Please provide all required fields.",
        });
      }
      const opdEntry = await prisma.oPDdata.create({
        data: {
          date,
          day,
          holiday,
          specialEvent,
          noofpatients,
          noofdoctors,
          time,
          ppdh,
          weather,
        },
      });
      res.json({
        success: true,
        message: "OPD data added successfully.",
        opdEntry,
      });
    } catch (e) {
      console.error("Error while adding OPD data:", e);
      res.status(500).json({
        success: false,
        error: e.message || "An error occurred while adding OPD data.",
      });
    }
  };
  
  export const addMultipleOPD = async (req, res) => {
    try {
      const prisma = req.prisma;
      const { opdEntries } = req.body;
      console.log(opdEntries)
      if (!Array.isArray(opdEntries) || opdEntries.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid input. Please provide an array of OPD entries.",
        });
      }
      for (const entry of opdEntries) {
        const {
          date,
          day,
          holiday,
          specialEvent,
          noofpatients,
          noofdoctors,
          time,
          ppdh,
          weather,
        } = entry;
  
        if (
          !date ||
          !day ||
          typeof holiday !== "boolean" ||
          typeof specialEvent !== "boolean" ||
          !Number.isInteger(noofpatients) ||
          !Number.isInteger(noofdoctors) ||
          typeof time !== "number" ||
          typeof ppdh !== "number" ||
          !weather
        ) {
          return res.status(400).json({
            success: false,
            message: `Invalid data for one or more entries: ${JSON.stringify(
              entry
            )}`,
          });
        }
      }
      const createdEntries = await prisma.oPDdata.createMany({
        data: opdEntries,
      });
      res.json({
        success: true,
        message: "All OPD data added successfully.",
        count: createdEntries.count,
      });
    } catch (e) {
      console.error("Error while adding multiple OPD data entries:", e);
      res.status(500).json({
        success: false,
        error: e.message || "An error occurred while adding OPD data.",
      });
    }
  };
  

export {addHospital,migratealldbs,createPatient,getPatientabhaId,adminregister,adminlogin}
