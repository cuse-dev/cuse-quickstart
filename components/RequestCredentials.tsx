import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { FillAction } from '@cusedev/core';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface RequestCredentialsProps {
  serviceId: string;
  actions: FillAction[];
}

const RequestCredentials: React.FC<RequestCredentialsProps> = ({ serviceId, actions }) => {
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        console.log(formData.entries());
        const credentials = Object.fromEntries(formData.entries());
        console.log('Successfully set credentials for service', serviceId, credentials);
    }
    return (
        <form className="mb-4" onSubmit={onSubmit}>
            <Card>
                <CardContent className="p-3 flex items-center space-x-2">
                    {actions.map((action, index) => (
                        <div key={index} className='flex flex-col gap-2'>
                            <Label>{action.type}</Label>
                            <Input name={action.type} type={action.type} placeholder={'Your ' + action.type} />
                        </div>
                    ))}
                </CardContent>
                <CardFooter>
                    <Button type="submit">Submit</Button>
                </CardFooter>
            </Card>
        </form>
    );
};

export default RequestCredentials;