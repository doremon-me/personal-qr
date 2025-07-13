export const forgetPassword = ({ otp }: { otp: string }) => {
    return `Your OTP for password reset is: *${otp}*. Please use this to reset your password.\nIf you did not request this, please ignore this message.`;
}

export const verification = ({ otp }: { otp: string }) => {
    return `Your verification OTP is: *${otp}*. Please use this to verify your account.\nIf you did not request this, please ignore this message.`;
}