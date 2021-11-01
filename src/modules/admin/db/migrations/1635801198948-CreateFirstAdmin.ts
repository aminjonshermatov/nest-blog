import {MigrationInterface, QueryRunner, Repository} from "typeorm";
import * as bcrypt from 'bcrypt';
import {AdminEntity} from "../../models/admin.entity";

export class CreateFirstAdmin1635801198948 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const adminRepository: Repository<AdminEntity> = queryRunner.connection.getRepository(AdminEntity);

        if (await adminRepository.findOne({ where: { login: 'admin' } })) {
            return;
        }

        const admin: AdminEntity = adminRepository.create({
            login: 'admin',
            passwordHash: await bcrypt.hash('pass', 10),
            nickName: 'aminjonshermatov'
        });

        await adminRepository.insert(admin);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const adminRepository: Repository<AdminEntity> = queryRunner.connection.getRepository(AdminEntity);
        const admin = await adminRepository.findOne({ where: { login: 'admin' } });

        if (!admin) {
            return;
        }

        await adminRepository.remove(admin);
    }

}
