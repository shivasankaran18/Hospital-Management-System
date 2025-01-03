

export let queue={}; 

function formatTimeToHHMM(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0'); 

    return `${hours}:${minutes}`;
}

function timeDifferenceInHours(time1, time2) {

    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    const totalMinutes1 = hours1 * 60 + minutes1;
    const totalMinutes2 = hours2 * 60 + minutes2;

    const minuteDifference = Math.abs(totalMinutes2 - totalMinutes1);

    return minuteDifference / 60;
}


export const insertPatient=(id)=>{
    if(!queue[id.doctorId])
        {
            queue[id.doctorId]=[];   
        }
    if(!id.intimated)
    {
        
        queue[id.doctorId].push(id);
    }
    else{
        let pos=-1;
        let currtime=formatTimeToHHMM(new Date());
        let flag=false;
        for(let i=0;i<queue[id.doctorId].length;i++)
        {
            if(!queue[id.doctorId][i].intimated)
            {
                if(queue[id.doctorId][i].demotion<2 || fn(i,currtime,id))
                {
                    pos=i;
                    flag=true;
                    break;
                }
            }

        }
        if(!flag)
        {
            queue[id.doctorId].push(id);
        }
        else{
            queue[id.doctorId].splice(pos, 0, id);

        }
    }

}

function fn( i, currtime,id)
{
    return timeDifferenceInHours(currtime,queue[id.doctorId][i].timeStamp)<0.5;
}