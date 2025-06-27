import { Prisma } from "./src/generated/prisma";
import DataAccessLayer from "./src/utils/DataAccessLayer";
import ksr_status from "./src/utils/ksr_status";
import { NextResponse } from "next/server";

export async function GET() {
    const data = await DataAccessLayer();
    if (data.privilege < 91) return NextResponse.json({ status: false, msg: ksr_status.unauthorized })

    console.log(Prisma.dmmf.datamodel)
    /*models: [
   {
     name: 'User',
     dbName: null,
     schema: null,
     fields: [Array],
     primaryKey: null,
     uniqueFields: [],
     uniqueIndexes: [],
     isGenerated: false,
     documentation: 'Tabel utama User'
   }*/
    const result = Prisma.dmmf.datamodel.models.map(({ name, documentation, fields }) => ({ name, documentation, fields: fields.map(({ name, type }) => ({ name, type })) }))

    return NextResponse.json({ status: true, data: result });
}