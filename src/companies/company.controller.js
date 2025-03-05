import { request, response } from 'express';
import Company from '../companies/company.model.js'
import ExcelJS from "exceljs";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

export const getCompaniesByAZ = async (req = request, res = response) => {
    try {
        const { limite, desde} = req.query;
        const query = { estado: true };

        const [total, companies] = await Promise.all([
            Company.countDocuments(query),
            Company.find(query)
                .sort({ name: 1 })
                .skip(Number(desde || 0))
                .limit(Number(limite || 10))
        ])

        res.status(200).json({
            success: true,
            total,
            companies
        })

    }catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al obtener las empresas',
            error
        })
    }
}

export const getCompaniesByZA = async (req = request, res = response) => {
    try {
        const { limite, desde } = req.query;
        const query = { estado: true };

        const [total, companies] = await Promise.all([
            Company.countDocuments(query),
            Company.find(query)
                .sort({ name: -1 })
                .skip(Number(desde || 0))
                .limit(Number(limite || 10))
        ])

        res.status(200).json({
            success: true,
            total,
            companies
        })

    }catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al obtener las empresas',
            error
        })
    }
}

export const getCompaniesByYear = async (req = request, res = response) => {
    try{
        const { limite, desde, years } = req.query;
        let query = { estado: true };

        if (years) {
            query.years = Number(years);
        }

        const [total, companies] = await Promise.all([
            Company.countDocuments(query),
            Company.find(query)
                .sort({ years: 1 })
                .skip(Number(desde) || 0)
                .limit(Number(limite) || 10)
        ]);

        res.status(200).json({
            success: true,
            total,
            companies
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener las empresas',
            error
        });
    }
};

export const createCompany = async (req, res) => {
    try {
        const data = req.body;

        const company = new Company({
            ...data
        });

        await company.save();

        res.status(200).json({
            success: true,
            company
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al guardar la empresa',
            error
        })
    }
}

export const updateCompany = async (req, res = response) => {
    try {
        const { id } = req.params;
        const {_id, ...data} = req.body;

        const company = await Company.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            success: true,
            msg: 'Empresa Actualizada',
            company
        })
    }catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar la empresa',
            error
        })
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateExcel = async (req, res) => {
    try {
        const companies = await Company.find();
        if (!companies || companies.length === 0) {
            return res.status(404).json({
                message: "No companies found"
            });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Companies Report");

        worksheet.columns = [
            { header: "Nombre", key: "name", width: 30 },
            { header: "Categoria", key: "category", width: 30 },
            { header: "Nivel de impacto", key: "impactLevel", width: 30 },
            { header: "Años de trayectoria", key: "years", width: 30 },
            { header: "Estado", key: "estado", width: 10 }
        ];

        companies.forEach(company => {
            worksheet.addRow({
                name: company.name,
                category: company.category,
                impactLevel: company.impactLevel,
                years: company.years,
                estado: company.estado ? "Activo" : "Inactivo"
            });
        });

        const dir = path.join(__dirname, "reports");
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const filePath = path.join(dir, "companies_report.xlsx");
        await workbook.xlsx.writeFile(filePath);

        res.status(200).json({
            message: "Excel file generated successfully",
            filePath: filePath
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to generate excel",
            error: error.message
        });
    }
};