"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Eye, Search, ChevronDown, Upload, Download, Trash, Plus, HelpCircle, RefreshCcw } from "lucide-react";
import DashboardLayout from "@/components/ui/DashboardLayout";
import clsx from "clsx";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useNegativeKeywordStore } from "@/store/negativeKeywordStore";
import { FilterBuilder, filterAttributes as fbAttributes } from "@/components/ui/FilterBuilder";
import { useAdvertiserStore } from '@/store/advertiserStore';
import { useCampaignTemplateStore } from '@/store/campaignTemplateStore';
import { v4 as uuidv4 } from 'uuid';
import { NewAutoTemplateContent } from './NewAutoTemplateContent';

// ... (mantener todas las interfaces y constantes)

// Componente principal que envuelve el contenido en Suspense
export default function NewAutoTemplatePage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-8 text-center text-xl">Loading...</div>}>
        <NewAutoTemplateContent />
      </Suspense>
    </DashboardLayout>
  );
} 