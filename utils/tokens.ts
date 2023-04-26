import jwt from "jsonwebtoken";
// npm i --include=dev @types/jsonwebtoken

const {ACTIVATION_TOKEN_SECRET, REST_TOKEN_SECRET} = process.env

export const createActivationToken = (payload: any) => {
    return jwt.sign(payload, ACTIVATION_TOKEN_SECRET!, {
        expiresIn : "2d",
    });
};

export const createResetToken = (payload: any) => {
    return jwt.sign(payload, REST_TOKEN_SECRET!, {
        expiresIn: "6h",
    })
}