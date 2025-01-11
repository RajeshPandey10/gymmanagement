import React from 'react';
import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";

const TrainerCard = ({ trainer }) => {
  return (
    <Card className="max-w-sm mx-auto">
      <img
        src={`https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`}
        alt={trainer.name}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <CardBody>
        <Typography variant="h5" className="mb-2 font-bold">
          {trainer.name}
        </Typography>
        <Typography variant="body2" className="mb-2">
          <strong>Email:</strong> {trainer.email}
        </Typography>
        <Typography variant="body2" className="mb-2">
          <strong>Phone:</strong> {trainer.phone}
        </Typography>
        <Typography variant="body2" className="mb-2">
          <strong>Specialization:</strong> {trainer.specialization}
        </Typography>
        <Typography variant="body2">
          <strong>Experience:</strong> {trainer.experience} years
        </Typography>
      </CardBody>
    </Card>
  );
};

export default TrainerCard;
