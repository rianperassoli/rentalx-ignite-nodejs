import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/im-memory/RentalsRepositoryInMemory";
import { DayJSDateProvider } from "@shared/container/providers/DateProvider/implementations/DayJSDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let createRentalUseCase: CreateRentalUseCase;
let dayJSDateProvider: DayJSDateProvider;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dayJSDateProvider = new DayJSDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayJSDateProvider,
      carsRepositoryInMemory
    );
  });

  it("should be able to create a new rental", async () => {
    const car = await carsRepositoryInMemory.create({
      brand: "Dodge",
      category_id: "86e4340f-0ecf-4c5b-89bc-0f3dc6243474",
      daily_rate: 950.0,
      description: "Pick-up",
      fine_amount: 200.0,
      license_plate: "RAM-2500",
      name: "Dodge RAM 2500",
    });

    const rental = await createRentalUseCase.execute({
      user_id: "12345",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental if there is another open to the same user", async () => {
    const car1 = await carsRepositoryInMemory.create({
      brand: "Dodge",
      category_id: "86e4340f-0ecf-4c5b-89bc-0f3dc6243474",
      daily_rate: 950.0,
      description: "Pick-up",
      fine_amount: 200.0,
      license_plate: "RAM-2500",
      name: "Dodge RAM 2500",
    });
    const car2 = await carsRepositoryInMemory.create({
      brand: "Dodge",
      category_id: "86e4340f-0ecf-4c5b-89bc-0f3dc6243474",
      daily_rate: 950.0,
      description: "Pick-up",
      fine_amount: 200.0,
      license_plate: "RAM-2500",
      name: "Dodge RAM 2500",
    });

    const rental = {
      user_id: "test",
      car_id: car1.id,
      expected_return_date: dayAdd24Hours,
    };
    await createRentalUseCase.execute(rental);

    rental.car_id = car2.id;

    await expect(createRentalUseCase.execute(rental)).rejects.toEqual(
      new AppError("There is a rental in progress for user!")
    );
  });

  it("should not be able to create a new rental if there is another open to the same car", async () => {
    const rental = {
      user_id: "12345455",
      car_id: "test",
      expected_return_date: dayAdd24Hours,
    };

    await createRentalUseCase.execute(rental);

    rental.user_id = "test 2";

    await expect(createRentalUseCase.execute(rental)).rejects.toEqual(
      new AppError("Car is not available")
    );
  });

  it("should not be able to create a rental with invalid return time", async () => {
    const rental = {
      user_id: "12345455",
      car_id: "test",
      expected_return_date: dayjs().toDate(),
    };

    await expect(createRentalUseCase.execute(rental)).rejects.toEqual(
      new AppError("Invalid return time!")
    );
  });
});
