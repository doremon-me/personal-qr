import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type UserFormInputs = {
    firstName: string;
    lastName: string;
    password: string;
    phone: string;
    email: string;
}

const CreateUserPopup: React.FC = () => {
    const { register, handleSubmit, reset } = useForm<UserFormInputs>();

    const onSubmit = (data: UserFormInputs) => {
        
        console.log("User Data:", data);
        reset();
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm h-10 w-full md:w-auto">
                 
                    Create User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-primary">
                        Create New User
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Fill out the form below to create a new user account.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium">
                            First Name
                        </Label>
                        <Input 
                            id="firstName"
                            {...register("firstName")}
                            placeholder="Enter first name"
                            className="w-full"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium">
                            Last Name
                        </Label>
                        <Input 
                            id="lastName"
                            {...register("lastName")}
                            placeholder="Enter last name"
                            className="w-full"
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">
                            Password
                        </Label>
                        <Input 
                            id="password"
                            type="tel"
                            {...register("password")}
                            placeholder="Enter phone number"
                            className="w-full"
                        />
                    </div>
                   <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">
                            Phone Number
                        </Label>
                        <Input 
                            id="phone"
                            type="tel"
                            {...register("phone")}
                            placeholder="Enter phone number"
                            className="w-full"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email Address
                        </Label>
                        <Input 
                            id="email"
                            type="email"
                            {...register("email")}
                            placeholder="Enter email address"
                            className="w-full"
                        />
                    </div>
                    
                    <DialogFooter className="pt-4">
                        <Button 
                            type="submit" 
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            Create User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateUserPopup;