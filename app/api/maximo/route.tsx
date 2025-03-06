import { NextResponse } from "next/server";

export async function GET() {
  // const response = await fetch(
  //   `${process.env.API_URL}api/os/mxwodetail?lean=1&oslc.pageSize=500&oslc.where=location.ust_tower="SHAW"&oslc.select=location.description,ust_createdby,ownergroup,status,description,ust_areacode,statusdate,wonum,location,location.ust_tower,location.ust_floor,location.location&oslc.orderBy=-statusdate&apikey=${process.env.API_KEY}`
  // );

  const response = await fetch(
    `${process.env.API_URL}api/os/mxwodetail?lean=1&oslc.pageSize=500&oslc.where=location.location="UST%25"&oslc.select=location.description,ust_createdby,ownergroup,status,description,ust_areacode,statusdate,wonum,location,location.ust_tower,location.ust_floor,location.location&oslc.orderBy=-statusdate&apikey=${process.env.API_KEY}`
  );

  if (!response.ok) return NextResponse.json({ message: "error" });

  const data = await response.json();
  const members = data["member"].map(
    (d: {
      status: any;
      location: { location: any; ust_floor: any };
      ust_areacode: any;
      description: any;
      statusdate: any;
      ust_createdby: any;
      wonum: any;
    }) => {
      return {
        status: d.status,
        location: d.location.location,
        floor: d.location.ust_floor,
        ust_areacode: d.ust_areacode,
        description: d.description,
        statusdate: d.statusdate,
        wonum: d.wonum,
        createdBy: d.ust_createdby,
      };
    }
  );
  
  return NextResponse.json(members);
}
