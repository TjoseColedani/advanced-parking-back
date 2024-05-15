import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Payment } from "src/entities/payment.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
  ) {}

  async createPayment(type_of_service: string, user: User, amount_paid: number) {
    const newPayment = await this.paymentRepository.create({
        type_of_service: type_of_service,
        amount_paid: amount_paid,
        user: user
    })
    await this.paymentRepository.save(newPayment)
    console.log(newPayment)
  }
}