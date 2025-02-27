import { NextResponse} from "next/server";

export async function GET() {
  const formData = new URLSearchParams();
  formData.append("j_username", "tungnilo");
  formData.append("j_password", "xxxxxx");

  await fetch(
    "https://maximo.ust.hk/maximo/j_security_check?event=loadapp&value=startcntr&login=true&j_username=tungnilo&j_password=ax",
    { method: "POST", credentials: "include" }
  )
    .then((response) => {
      const cookie = response.headers.get("Set-cookie");
        console.log(cookie);

      return fetch(
        "https://maximo.ust.hk/maximo/oslc/os/mxwodetail?oslc.pageSize=10&oslc.select=location,ust_createdby,ownergroup,status,description,ust_areacode,statusdate",
        {
          method: "GET",
          headers: { cookie: cookie! },
        }
      );
    })
    .then((response) => response.text())
    .then((data) => console.log(data.length));

  return NextResponse.json({ message: "ok" });
}
