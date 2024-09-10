"use client";
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

interface EmailPromptFormProps {
  onEmailSubmit: (email: string) => void;
  onSkip: () => void;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    font: string;
    fontSize: string;
    fontColor?: string;
  };
  welcomeMessage: string;
}

const EmailPromptForm = ({ onEmailSubmit, onSkip, theme, welcomeMessage }: EmailPromptFormProps) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEmailSubmit(email);
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8" style={{ backgroundColor: theme.backgroundColor }}>
      <CardHeader>
        <CardTitle style={{ color: theme.primaryColor, fontFamily: theme.font }}>Welcome!</CardTitle>
        <CardDescription style={{ color: theme.fontColor, fontFamily: theme.font }}>Please Enter Your Email To Continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
            style={{ borderColor: theme.primaryColor, color: theme.fontColor, fontFamily: theme.font }}
          />
          <Button type="submit" className="w-full" style={{ backgroundColor: theme.primaryColor, color: theme.backgroundColor }}>
            Start Chatting
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmailPromptForm;
