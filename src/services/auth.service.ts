import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { IGlobalResponse, ILoginResponse } from "../interfaces/global.interface.js";
import { error } from "console";

const prisma = new PrismaClient();


const UGenerateToken = (payload: any): string => {
  console.log("Generating token for user:", payload.username);
  return "placeholder-jwt-token";
};

export const SLogin = async (
  usernameOrEmail: string,
  password: string
): Promise<IGlobalResponse<ILoginResponse>> => {
  // Fix 1: Find the admin by username or email only.
  const admin = await prisma.admin.findFirst({
    where: {
      OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      isActive: true,
      deletedAt: null,
    },
  });

  if (!admin) {
    throw new Error("Admin not found or inactive");
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const token = UGenerateToken({
    id: admin.id,
    username: admin.username,
    email: admin.email,
    name: admin.name,
  });

  return {
    status: true,
    message: "Login successful",
    data: {
      token: token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
      },
    },
  };
};

export const SRegisterAdmin = async (
  username : string,
  email : string,
  name : string,
  password : string
): Promise<IGlobalResponse> => {
  const existingAdmin = await prisma.admin.findFirst ({
    where : {
      OR : [{username},{email}],
      deletedAt : null

    },
  });
  if (existingAdmin) {
    throw new Error("Username or email already in use");
  }
  const hashpassword = await bcrypt.hash(password,10);
  const newAdmin = await prisma.admin.create({
    data: {
      username,
      email,
      name,
      password : hashpassword,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  });

  return {
    status: true,
    message: "Admin registered successfully",
    data: {
      id: newAdmin.id,
      username: newAdmin.username,
      email: newAdmin.email,
      name: newAdmin.name,
    },
  };
};
export const SUpdateAdmin = async (
  id: number,
  username: string ,
  email: string ,
  name: string ,
  password: string
): Promise<IGlobalResponse> => {
  const admin = await prisma.admin.findUnique({
    where: { id },
  });

  if (!admin) {
    throw new Error("Admin not found");
  }

  const updateAdmin = await prisma.admin.update({
    where: { id },
    data: {
      username: username ?? admin.username,
      email: email ?? admin.email,
      name: name ?? admin.name,
      password: password ? await bcrypt.hash(password, 10) : admin.password,
      updatedAt: new Date(),
    },
  });

  return {
    status: true,
    message: "Admin updated successfully",
    data: {
      id: updateAdmin.id,
      username: updateAdmin.username,
      email: updateAdmin.email,
      name: updateAdmin.name,
    },
  };
};

export const SdeleteAdmin = async ( 
  id : number
) : Promise <IGlobalResponse> => {
  const admin = await prisma.admin.findUnique({
    where : {id}
  });
  if(!admin){
    throw new Error("Admin Not Found!");
  }
  await prisma.admin.delete({
    where:{id}
  });
  return {
    status: true,
    message: "Admin deleted successfully",
    data: {
      id: id
    },
  };
}
