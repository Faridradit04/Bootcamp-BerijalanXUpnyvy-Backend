
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
import { IGlobalResponse, ILoginResponse } from "../interfaces/global.interface.js";
export const SCreateCounter = async (
  id: number,
  name: string,
  currentQueue: number,
  maxQueue: number,
  isActive: boolean,
): Promise<IGlobalResponse> => {
  
  const checkCounter = await prisma.counter.findFirst({
    where: {
      name,
      deletedAt: null,
    },
  });

  if (checkCounter) {
    throw new Error("Counter already exists");
  }


  const newCounter = await prisma.counter.create({
    data: {
      name,
      currentQueue,
      maxQueue,
      isActive,
    },
  });

  return {
    status: true,
    message: "Counter Created Successfully",
    data: {
      id: newCounter.id,
      name: newCounter.name,
      currentQueue: newCounter.currentQueue,
      maxQueue: newCounter.maxQueue,
      isActive: newCounter.isActive,
    },
  };
};




export const CGetCounter = async (
 id : number
) : Promise <IGlobalResponse> => {
const GetCounter= await prisma.counter.findUnique ({
    where : {id},
    select : {
        id : true,
        name:true,
        currentQueue:true,
        maxQueue:true,
        isActive:true,
        createdAt:true,
        updatedAt:true,
        queues : true,
    }
})
if (!GetCounter) {
    throw new Error ("Counter not Found or Inactive");
}
return {
    status : true,
    message: "Counter Founded",
    data : 
        GetCounter
    
} 
}

export const CUpdateCounter = async (
  id: number,
  name : string,
  currentQueue: number,
  maxQueue: number,
  isActive: boolean,
): Promise<IGlobalResponse> => {
  const updatecounter = await prisma.counter.findUnique({
    where: { id }
  })
  if (!updatecounter) {
    throw new Error ("Counter Not Found")
  }
  const Updatecounter= await prisma.counter.update({
    where : {id},
    data: {
        name : name ?? updatecounter.name,
        currentQueue: currentQueue??updatecounter.currentQueue,
        maxQueue: maxQueue?? updatecounter.maxQueue,
        isActive:true
    }

  })
  return {
    status: true,
    message: "Data Updated",
    data: Updatecounter
  }
}
        
export const CDeleteCounter = async (
    id : number
) :Promise <IGlobalResponse> => {
    const DeleteCounter = await prisma.counter.findUnique({
        where: { id}
    })
    if (!DeleteCounter){
        throw new Error ("Counter Not Found")
    }
    await prisma.counter.delete({
        where: {id}
    });
    return {
        status:true,
        message:"Counter Deleted Successfully",
        data : {
            id:id
        }
    }
}
