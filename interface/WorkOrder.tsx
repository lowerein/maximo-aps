export interface WorkOrder {
  wonum: string;
  description?: string;
  ust_areacode: string;
  location: string;
  statusdate: string;
  floor?: string;
  status: string;
  createdBy?: string;
  reportedby?: string;
  ownergroup?: string;
  reportdate?: string;
  origrecordid?: string;
  email?: string;
  phone?: string;
}
