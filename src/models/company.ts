import { Guid } from "./types";

export type Company = {
  id: Guid;
  name: string;
}

export type CompanyListItem = Company & {}

export type CreateCompanyRequest = {
  name: string;
}

export type UpdateCompanyRequest = {
  id: Guid;
  name: string;
}