// service/changeGeneralTimeToLocalTime.ts

type TTime = string | number | Date;

export const  ChangeGeneralTimeToLocalTimeAndDate =(myTime: TTime) => {
  const localTime = new Date(myTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    day : "numeric" , 
    month : "numeric" , 
    year : "numeric"
  });
  return localTime;
}


export const  ChangeGeneralTimeToLocalTime=(myTime: TTime) => {
  const localTime = new Date(myTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",

  });
  return localTime;
}