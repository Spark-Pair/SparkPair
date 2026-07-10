import { AdminListLoading } from "@/components/admin/admin-skeleton"

export default function ProductReleasesLoading() {
  return <AdminListLoading title="Product Releases" description="Loading release feed entries." tableTitle="Releases" columns={6} />
}
