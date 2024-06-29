import { Company } from "../../models/company";

export type DepartmentsSectionProps = {
  activeCompany: Company;
};

export function DepartmentsSection({ activeCompany }: DepartmentsSectionProps) {
  return <>Areas de {activeCompany.name}</>;
}
