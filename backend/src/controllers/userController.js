import prisma from "../DB/db.config.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (findUser) {
      res.json({ status: 400, message: "Email already taken" });
    }

    const data = await prisma.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 100),
      },
    });

    res.send({ message: "User Created Sucessfully", data: data }); // Remove data in production
  } catch (error) {
    console.log(error);
    res.send({ message: "Internal Server Error" });
  }
};

export const getUser = async (req, res) => {
  try {
    let { getEmail, getPassword } = req.body;

    const checkDetil = await prisma.user.findUnique({
      where: {
        email: getEmail,
      },
    });

    if (!checkDetil) {
      res.send({ message: "Invalid credential" });
    }

    const checkPassword = await bcrypt.compare(
      getPassword,
      checkDetil.password
    );

    if (!checkPassword) {
      res.send({ message: "Invalid credential" });
    }

    res.send({ message: "Sucessful" });
  } catch (error) {
    console.log(error);
    res.send({ message: "Internal Server Error" });
  }
};

// No option to update user details as of now

export const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await prisma.user.delete({ where: { email } });
    if (!result) {
      res.send({ message: "Invalid User" });
    }
    res.send({ message: "User Deleted Sucessfully" });
  } catch (error) {
    res.send({ message: "Internal Server Error" });
  }
};
