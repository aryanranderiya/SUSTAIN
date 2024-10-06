'use client'

import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const body = await req.json()
  const { messages } = body

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    })

    const message = completion.choices[0].message.content

    return NextResponse.json({ message })
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.error()
  }
}