import User from '../users/user.model.js';
import Company from '../companies/company.model.js';

export const existenteEmail = async (correo = ' ') => {

    const existeEmail = await User.findOne({ correo });

    if(existeEmail){
        throw new Error(`El correo ${ correo } ya existe en la base de datos`);
    }
}

export const existeUsuarioById = async (id = '') => {
    
    const existeUsuario = await User.findById(id);

    if(!existeUsuario){
        throw new Error(`El ID ${id} no existe`);
    }
}

export const existeCompanyById = async (id = '') => {
    
    const existeCompany = await Company.findById(id);

    if(!existeCompany){
        throw new Error(`El ID ${id} no existe`);
    }
}