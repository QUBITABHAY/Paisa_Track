import prisma from "../config/db.config.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    const findUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (findUser) {
      return res.status(409).json({
        success: false,
        message: "Email already taken"
      });
    }

    const data = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        password: await bcrypt.hash(password, 12),
      },
    });

    const { password: _, ...userWithoutPassword } = data;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userWithoutPassword
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
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
