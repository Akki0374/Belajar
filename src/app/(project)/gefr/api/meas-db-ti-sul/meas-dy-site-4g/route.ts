// biome-ignore assist/source/organizeImports: <will fix later>
import type { Data2G4GModel } from "@/types/schema";
import { db_conn_v2 } from "../../../_drizzle/db_ti_sul";
import { sql } from "drizzle-orm";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get("siteId") || "---";
  const tgl_1 = searchParams.get("tgl_1");
  const tgl_2 = searchParams.get("tgl_2");

  if (!tgl_1 || !tgl_2) {
    return NextResponse.json({ error: "Both tgl_1 and tgl_2 parameters are required" }, { status: 400 });
  }

  let formattedTgl1: string;
  let formattedTgl2: string;
  const querySiteId = `%${siteId.toUpperCase()}%`;

  try {
    formattedTgl1 = new Date(tgl_1).toISOString();
    formattedTgl2 = new Date(tgl_2).toISOString();

    const result = await db_conn_v2.execute<Data2G4GModel>(sql`
          SELECT
            t1."Begin Time" AS "BEGIN_TIME",
            t1."Cell Name" as "CELL_NAME",
            
            SUM("DL Traffic Volume (MByte) AMQ") / 1024 AS "DL_PAYLOAD_GB",
            SUM("UL Traffic Volume (MByte) AMQ") / 1024 AS "UL_PAYLOAD_GB",
            SUM("4G Payload (MByte) AMQ") / 1024 AS "TOTAL_PAYLOAD_GB",
            SUM("4G Payload (MByte) AMQ") / 1024 / 1024 AS "TOTAL_PAYLOAD_TB",
            SUM("Traffic_VoLTE_(erl) AMQ") AS "TRAFFIC_VOLTE_ERL",
            SUM("Maximum Number of RRC Connection User(unit)") AS "AVG_MAX_NUMBER_RRC_CONNECTION_USER",
						SUM("Cell Availability Num 4G AMQ") AS "AVAILABILITY_NUM",
						SUM("Cell Availability Denum 4G AMQ") AS "AVAILABILITY_DENUM",
            SUM("Num RRC Setup SR AMQ") AS "RRC_SETUP_SR_NUM",
						SUM("Denum RRC Setup SR AMQ") AS "RRC_SETUP_SR_DENUM",
            SUM("Num E-RAB Setup SR AMQ") AS "ERAB_SETUP_SR_NUM",
						SUM("Denum E-RAB Setup SR AMQ") AS "ERAB_SETUP_SR_DENUM",
            SUM("Num CSSR AMQ") AS "CSSR_NUM",
						SUM("Denum CSSR AMQ") AS "CSSR_DENUM",
            SUM("Num Service Drop Rate AMQ") AS "SERVICE_DROP_RATE_NUM",
						SUM("Denum Service Drop Rate AMQ") AS "SERVICE_DROP_RATE_DENUM",
						SUM("DL PRB Utilization Num AMQ") AS "DL_PRB_UTILIZATION_NUM",
						SUM("DL PRB Utilization Denum AMQ") AS "DL_PRB_UTILIZATION_DENUM",
         	  SUM("UL PRB Utilization Num AMQ") AS "UL_PRB_UTILIZATION_NUM",
						SUM("UL PRB Utilization Denum AMQ") AS "UL_PRB_UTILIZATION_DENUM",
						SUM("User DL Throughput Num AMQ") AS "USER_DL_THP_NUM",
						SUM("User DL Throughput Denum AMQ") AS "USER_DL_THP_DENUM",
            
            '1' AS "DENUMBY1"
          FROM
            "measDy4g" t1
            
          WHERE
            t1."Begin Time" >= ${formattedTgl1} :: TIMESTAMP
            AND t1."Begin Time" <= ${formattedTgl2} :: TIMESTAMP
            AND t1."Cell Name" like ${querySiteId}
          GROUP BY
            t1."Begin Time",
            t1."Cell Name"
          ORDER BY
            t1."Begin Time",
            t1."Cell Name"
        `);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
