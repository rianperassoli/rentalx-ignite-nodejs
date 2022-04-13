import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Car", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it("should be able to create a new car", async () => {
    const car = {
      name: "Car name",
      description: "Car description",
      daily_rate: 10,
      license_plate: "Car plate",
      fine_amount: 60,
      brand: "Car brand",
      category_id: "category",
    };

    const newCar = await createCarUseCase.execute(car);

    expect(newCar).toHaveProperty("id");
  });

  it("should not be able to create a car with exists license plate", async () => {
    const car = {
      name: "Car name",
      description: "Car description",
      daily_rate: 10,
      license_plate: "Car plate",
      fine_amount: 60,
      brand: "Car brand",
      category_id: "category",
    };

    await createCarUseCase.execute(car);

    await expect(createCarUseCase.execute(car)).rejects.toEqual(
      new AppError("Car already exists!")
    );
  });

  it("should be able to create a car with available true by default", async () => {
    const car = {
      name: "Car name",
      description: "Car description",
      daily_rate: 10,
      license_plate: "Car plate",
      fine_amount: 60,
      brand: "Car brand",
      category_id: "category",
    };

    const newCar = await createCarUseCase.execute(car);

    expect(newCar.available).toBe(true);
  });
});
