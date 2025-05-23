"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/ui/DashboardLayout";

export default function EditAgencyFeedPage() {
  const router = useRouter();
  const params = useParams();
  const feedId = params.feedId;
  const [feed, setFeed] = useState<any>(null);

  useEffect(() => {
    // Aquí irá la lógica para cargar los datos del feed
    setFeed(null);
  }, [feedId]);

  if (!feed) return <div className="p-8">Loading...</div>;

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Agency Feed</h1>
        {/* Aquí irá el contenido del formulario */}
      </div>
    </DashboardLayout>
  );
} 