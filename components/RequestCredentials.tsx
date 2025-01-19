import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AuthElement, Computer } from '@cusedev/core';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface RequestCredentialsProps {
  service: string;
  actions: AuthElement[];
}

const RequestCredentials: React.FC<RequestCredentialsProps> = ({ service, actions }) => {
	const [isSuccess, setIsSuccess] = useState(false);
	
	const computer = new Computer({
		config: {
			baseUrl: "http://localhost:4242/quickstart-computer",
		},
	});
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const item = Object.fromEntries(formData.entries());
        computer.system.keychain.setItem({ service, item });
        setIsSuccess(true);
    }
    return (
        <form className="mb-4" onSubmit={onSubmit}>
            <Card>
                <CardContent className="p-3 flex items-center space-x-2">
                    {actions.map((action, index) => (
                        <div key={index} className='flex flex-col gap-2'>
                            <Label>{action.type}</Label>
                            <Input 
                                name={action.type} 
                                type={action.type} 
                                placeholder={'Your ' + action.type}
                                disabled={isSuccess}
                            />
                        </div>
                    ))}
                </CardContent>
                <CardFooter>
                    <Button 
                        type="submit" 
                        disabled={isSuccess}
                    >
                        {isSuccess ? 'Success' : 'Submit'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
};

export default RequestCredentials;