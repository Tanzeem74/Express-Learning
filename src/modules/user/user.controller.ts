import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";


const createUser = async (req: Request, res: Response) => {
    //console.log(req.body)
    //const { name, email, password, age } = req.body;
    try {
        const result = await userService.createUserIntoDB(req.body)
        res.status(201).json({
            message: "user created successfully",
            data: result.rows[0],
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            data: error,
        });
    }
}

const getAllUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.getAllUserFromDB();
        res.status(200).json({
            success: true,
            message: "Users retrived Successfully",
            data: result.rows
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
}

const getSingleUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await userService.getSingleUserFromDB(id as string)
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Not Found",
                data: {}
            })
        }
        res.status(200).json({
            success: true,
            message: "User retrived Successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
}

const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    //const { name, password, age, is_active } = req.body;
    try {
        const result = await userService.updateUserFromDB(req.body, id as string)
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Not Found",
                data: {}
            })
        }
        res.status(200).json({
            success: true,
            message: "Updated successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
}

const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await userService.deleteUserFromDB(id as string)
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "Not Found",
                data: {}
            })
        }
        res.status(200).json({
            success: true,
            message: "Deleted successfully",
            data: {}
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
}
export const userController = {
    createUser,
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser
}