import { z } from 'zod';
import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { WalletEntity } from './domain/wallet.entity';

export const walletSchema = z.object({
  id: z.string().min(1).max(255),
  createdAt: z.preprocess((val: any) => new Date(val), z.date()),
  updatedAt: z.preprocess((val: any) => new Date(val), z.date()),
  balance: z.number().min(0).max(9999999),
  userId: z.string().min(1).max(255),
});

export type WalletModel = z.TypeOf<typeof walletSchema>;

@Injectable()
export class WalletMapper implements Mapper<WalletEntity, WalletModel> {
  toPersistence(entity: WalletEntity): WalletModel {
    const copy = entity.getPropsCopy();
    const record: WalletModel = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      userId: copy.userId,
      balance: copy.balance,
    };
    return walletSchema.parse(record);
  }

  toDomain(record: WalletModel): WalletEntity {
    const entity = new WalletEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        userId: record.userId,
        balance: record.balance,
      },
    });
    return entity;
  }

  toResponse(): any {
    throw new Error('Not implemented');
  }
}
