"use client"

import { LiFiWidget, type WidgetConfig } from '@lifi/widget';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const widgetConfig: WidgetConfig = {
    theme: {
        container: {
            border: 'none',
            borderRadius: '16px',
        },
    },
    integrator: 'Sentifolio',
    appearance: 'light',
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Crypto Exchange</h1>
          <p className="text-lg text-muted-foreground">
            Swap tokens across multiple chains with the best rates
          </p>
        </div>
        
        <Card className="w-full bg-background">
          <CardHeader>
            <CardTitle>Token Swap</CardTitle>
            <CardDescription>Choose your tokens and amount to swap</CardDescription>
          </CardHeader>
          <div className="p-6">
            <LiFiWidget integrator="Sentifolio" config={widgetConfig} />
          </div>
        </Card>
      </div>
    </div>
  );
}
