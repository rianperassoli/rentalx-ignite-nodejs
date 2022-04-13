import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  id: string;
  user_id: string;
}

@injectable()
class DevolutionRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ id, user_id }: IRequest): Promise<Rental> {
    const MINIMUM_DAILY = 1;

    const rental = await this.rentalsRepository.findById(id);
    const car = await this.carsRepository.findById(rental.car_id);

    if (!rental) {
      throw new AppError("Rental does not exist!");
    }
    const dateNow = this.dateProvider.dateNow();

    let daily = this.dateProvider.compareInDays(rental.start_date, dateNow);

    if (daily <= 0) {
      daily = MINIMUM_DAILY;
    }

    const diffInDays = this.dateProvider.compareInDays(
      dateNow,
      rental.expected_return_date
    );

    const total_fine_amount = diffInDays > 0 ? diffInDays * car.fine_amount : 0;
    const total_daily_rate = daily * car.daily_rate;

    rental.end_date = this.dateProvider.dateNow();
    rental.total = total_fine_amount + total_daily_rate;

    const updatedRental = await this.rentalsRepository.create(rental);
    await this.carsRepository.updateAvailable(car.id, true);

    return updatedRental;
  }
}

export { DevolutionRentalUseCase };
