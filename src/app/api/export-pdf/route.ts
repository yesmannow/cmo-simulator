import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { SimulationReport } from '@/components/pdf/SimulationReport';
import { SimulationContext } from '@/lib/simMachine';

export async function POST(request: NextRequest) {
  try {
    const { context }: { context: SimulationContext } = await request.json();
    
    if (!context) {
      return NextResponse.json(
        { error: 'Simulation context is required' },
        { status: 400 }
      );
    }

    // Generate PDF buffer
    const pdfBuffer = await renderToBuffer(
      React.createElement(SimulationReport, {
        context,
        generatedAt: new Date()
      })
    );

    // Create response with PDF
    const response = new NextResponse(pdfBuffer);
    
    // Set headers for PDF download
    response.headers.set('Content-Type', 'application/pdf');
    response.headers.set(
      'Content-Disposition', 
      `attachment; filename="cmo-simulation-report-${Date.now()}.pdf"`
    );
    response.headers.set('Content-Length', pdfBuffer.length.toString());

    return response;
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF report' },
      { status: 500 }
    );
  }
}
