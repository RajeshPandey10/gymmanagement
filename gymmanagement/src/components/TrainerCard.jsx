import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Rating,
} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function TrainerCard({ trainer }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBooking = () => {
    if (!user) {
      navigate('/auth/sign-in');
      return;
    }
    navigate(`/book-trainer/${trainer.id}`);
  };

  return (
    <Card className="max-w-[24rem] overflow-hidden">
      <CardHeader 
        floated={false} 
        className="h-60"
      >
        <img
          src={trainer.image}
          alt={trainer.name}
          className="w-full h-full object-cover"
        />
      </CardHeader>
      <CardBody>
        <Typography variant="h4" color="blue-gray">
          {trainer.name}
        </Typography>
        <Typography variant="lead" color="gray" className="mt-3 font-normal">
          {trainer.specialization}
        </Typography>
        <div className="flex items-center gap-2 mt-2">
          <Rating value={trainer.rating || 5} readonly />
          <Typography color="blue-gray" className="font-medium">
            {trainer.rating || 5}.0
          </Typography>
        </div>
        <Typography color="gray" className="mt-3">
          {trainer.description}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0">
        <Button
          onClick={handleBooking}
          className="bg-[#e2ff3d] text-gray-900 hover:bg-[#c8e235]"
        >
          Book Session
        </Button>
      </CardFooter>
    </Card>
  );
}
