"use client";

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { evalueEssay } from "../service/essayService"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react";

export default function ({ simulatedId, theme }: { simulatedId: string; theme: string }) {
  const [essay, setEssay] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    evalueEssay(simulatedId, essay, theme);
    router.push("/simulated");
    setIsSubmitting(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-3xl mx-auto mt-20">
          <CardHeader>
            <CardTitle>Transcrição da Redaçãoo</CardTitle>
            <CardDescription>Transcreva aqui sua redação palavra por palavra, incluindo eventuais rasuras e correções, exatamente como está no papel...</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              placeholder="Start writing your essay here..."
              className="w-full min-h-[600px] resize-y p-4 text-lg leading-relaxed border rounded-md focus:ring-2 focus:ring-primary"
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
            />
            <div className="mt-2 text-right text-sm text-muted-foreground">
              {essay.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          </CardContent>

          <CardFooter className="pt-6 pb-4 px-6 border-t">
            <Button type="submit" disabled={isSubmitting} className="ml-auto transition-all hover:scale-105">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submetendo redação...
                </>
              ) : (
                "Submeter redação"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

