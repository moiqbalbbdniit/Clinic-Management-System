// src/app/api/seed/route.ts
import { NextResponse } from "next/server";
import { PatientModel } from "@/lib/model/Patients";
import { PaymentModel } from "@/lib/model/Payment";
import dbConnect from "@/lib/db";
import { faker } from "@faker-js/faker";

export async function POST() {
  await dbConnect();

  // Clear previous data (optional)
  //await PatientModel.deleteMany({});
  //await PaymentModel.deleteMany({});

  for (let i = 0; i < 100; i++) {
    const startDigit = faker.helpers.arrayElement(["6", "7", "8", "9"]);
    const mobile = startDigit + faker.string.numeric(9);

    const date = faker.date.between({ from: new Date("2025-06-01"), to: new Date("2025-08-31") });

    const patient = await PatientModel.create({
      name: faker.person.fullName(),
      address: faker.location.streetAddress(),
      mobile,
      disease: faker.lorem.word(),
      totalCost: faker.number.int({ min: 1000, max: 10000 }),
      dateOfVisit: date,
    });

    const numPayments = faker.number.int({ min: 1, max: 3 });
    let paid = 0;

    for (let j = 0; j < numPayments; j++) {
      const amount = faker.number.int({ min: 500, max: 3000 });
      paid += amount;

      await PaymentModel.create({
        patientId: patient._id,
        amount,
        date: faker.date.between({ from: date, to: new Date("2025-08-31") }),
      });

      if (paid >= patient.totalCost) break;
    }
  }

  return NextResponse.json({ message: "Seeded successfully!" });
}
