import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryImMemory: CarsRepositoryInMemory;

describe("List Cars", () => {
  beforeEach(() => {
    carsRepositoryImMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryImMemory
    );
  });

  it("should be able to list all available cars", async () => {
    const car = {
      brand: "Car brand 1",
      name: "Car 1",
      description: "Description Car 1",
      license_plate: "PLATE-0007",
      daily_rate: 950.0,
      fine_amount: 200.0,
      category_id: "category",
    };

    const newCar = await carsRepositoryImMemory.create(car);

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([newCar]);
  });

  it("should be able to list all available cars by name", async () => {
    const car = {
      brand: "Car brand 1",
      name: "Car 1",
      description: "Description Car 1",
      license_plate: "PLATE-0007",
      daily_rate: 950.0,
      fine_amount: 200.0,
      category_id: "category",
    };

    const newCar = await carsRepositoryImMemory.create(car);

    const cars = await listAvailableCarsUseCase.execute({ name: "Car 1" });

    expect(cars).toEqual([newCar]);
  });

  it("should be able to list all available cars by brand", async () => {
    const car = {
      brand: "Car brand 1",
      name: "Car 1",
      description: "Description Car 1",
      license_plate: "PLATE-0007",
      daily_rate: 950.0,
      fine_amount: 200.0,
      category_id: "category",
    };

    const newCar = await carsRepositoryImMemory.create(car);

    const cars = await listAvailableCarsUseCase.execute({
      brand: "Car brand 1",
    });

    expect(cars).toEqual([newCar]);
  });

  it("should be able to list all available cars by category", async () => {
    const car = {
      brand: "Car brand 1",
      name: "Car 1",
      description: "Description Car 1",
      license_plate: "PLATE-0007",
      daily_rate: 950.0,
      fine_amount: 200.0,
      category_id: "category",
    };

    const newCar = await carsRepositoryImMemory.create(car);

    const cars = await listAvailableCarsUseCase.execute({
      category_id: "category",
    });

    expect(cars).toEqual([newCar]);
  });
});
