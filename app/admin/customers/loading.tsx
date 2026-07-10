import { AdminListLoading } from "@/components/admin/admin-skeleton"

export default function CustomersLoading() {
  return <AdminListLoading title="Customers" description="Loading customer records." tableTitle="Customer records" columns={5} />
}
