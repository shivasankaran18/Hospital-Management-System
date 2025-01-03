import express from "express"
import { getHospitalPrismaClient } from "../middleware/prismaProvider.js";

import { addDepartments, addSlot, addWard, allocateBed, allocateDoctor, createPatientInstance, getAdmissionsBedNotAllocated, getDepartmentByName, getDepartments, getDoctors, getHosCodes, getHospital, getHospitalDetails, getIntimated, getOnlineDoctors, getPatient, getTmrwDocPred, getWard } from "../controllers/hospitalController.js";




const hospitalRouter = express.Router();

hospitalRouter.get("/getdoctors",getHospitalPrismaClient,getDoctors);
hospitalRouter.post("/adddepartment",getHospitalPrismaClient,addDepartments)
hospitalRouter.get("/getdepartments",getHospitalPrismaClient,getDepartments)
hospitalRouter.post("/createpatient",getHospitalPrismaClient,createPatientInstance)
hospitalRouter.post("/addward",getHospitalPrismaClient,addWard)
hospitalRouter.get("/getunallocated",getHospitalPrismaClient,getAdmissionsBedNotAllocated)
hospitalRouter.post("/allocate",getHospitalPrismaClient,allocateBed)
hospitalRouter.get("/getpatientdetails",getHospitalPrismaClient,getPatient)
hospitalRouter.get("/getward",getHospitalPrismaClient,getWard)
hospitalRouter.get("/gethoscodes",getHosCodes)
hospitalRouter.get("/getcheckins",getHospitalPrismaClient,getIntimated)
hospitalRouter.post("/addslot",getHospitalPrismaClient,addSlot);
hospitalRouter.get("/gethospitals",getHospital);
hospitalRouter.get("/getdetails",getHospitalPrismaClient,getHospitalDetails);
hospitalRouter.post("/getonlinedoctors",getHospitalPrismaClient,getOnlineDoctors);
hospitalRouter.post("/allocatedoc",getHospitalPrismaClient,allocateDoctor);
hospitalRouter.post("",getHospitalPrismaClient,getDepartmentByName)
export {hospitalRouter}
