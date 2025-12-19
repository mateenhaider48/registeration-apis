const express = require('express');
const jwt  = require('jsonwebtoken');

const authCheck = async(req,res,next)=>{
      
    const authHeader = req.headers.authorization;

    if(!authHeader){

        res.status(401).json({
            message:"Athorization header missing"
        })
    }

    if(!authHeader.startsWith("Bearer ")){
        res.status(401).json({
            message:"Invalid token format"
        })
    }
    const token = authHeader.split(" ")[1];

    try {
        
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decode;

        next();
    } catch (error) {
        
        res.status(401).json({
            message:"Token invalid or expired"
        })
    }
    

}


const authorized = (allowedRoles=[])=>{
    return (req,res,next)=>{
        
        if(!allowedRoles.includes(req.user.role)){
            res.status(403).json({
                message:"Forbidden: Access denied"
            })

            next();
        }
}}


module.exports = {authCheck, authorized};