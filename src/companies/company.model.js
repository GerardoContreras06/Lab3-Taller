import { Schema, model } from "mongoose";

const CompanySchema = Schema({
    name: {
        type: String,
        required: [true, "El nombre de la empresa es requerido"],
        maxLength: [100, "El maximo permitido son 100 caracteres"]
    },
    category: {
        type: String,
        enum: ["Microempresa", "Pequeña empresa", "Mediana empresa", "Gran empresa"],
        default: "Pequeña empresa"
    },
    years: {
        type: Number,
        minLength: 3,
        maxLength: 3,
        required: true
    },
    impactLevel: {
        type: String,
        enum: ["Economico", "Social", "Ambiental"],
        default: "Economico"
    },
    estado: {
        type: Boolean,
        default: true,
    },
},
{
    timestamps: true,
    versionKey: false
});

export default model('Company', CompanySchema)