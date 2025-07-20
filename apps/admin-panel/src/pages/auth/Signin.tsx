import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/shared/icon";
import { useState } from "react";
import { useSignin } from "./api";

const Signin = () => {
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: signin, isPending } = useSignin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signin({ number, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="min-w-[320px] w-full max-w-[450px] border-border bg-card shadow-lg">
        <CardHeader>
          <CardTitle className="text-foreground text-2xl">
            👋 Welcome Back!
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            🚀 Login to continue your journey!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="number" className="text-foreground">
                Number
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <Icon name="Phone" size={16} />
                </div>
                <Input
                  id="number"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="pl-10 bg-input text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 bg-input text-foreground placeholder:text-muted-foreground"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <Icon
                    name={showPassword ? "EyeOff" : "Eye"}
                    size={16}
                    className="text-muted-foreground"
                  />
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full mt-6" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            Forgot your password?{" "}
            <a href="/auth/reset" className="text-primary hover:underline">
              Reset it here
            </a>
          </p>
          <p className="text-sm text-muted-foreground text-center">
            Don't have an account?{" "}
            <a href="/auth/signup" className="text-primary hover:underline">
              Sign Up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signin;
