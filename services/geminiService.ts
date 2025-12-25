
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

// Fix: Initializing Gemini API client strictly using the environment variable without default fallback
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseQuizContent = async (htmlContent: string): Promise<Question[]> => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    Bạn là một chuyên gia phân tích tài liệu giáo dục. 
    Dưới đây là nội dung HTML được trích xuất từ một tệp Word chứa các câu hỏi trắc nghiệm.
    Nội dung có thể chứa các tag ảnh giả lập dạng [IMAGE_REF_X] (với X là số thứ tự).

    QUY TẮC PHÂN TÍCH QUAN TRỌNG:
    1. Xác định đáp án ĐÚNG: Đáp án đúng là đáp án mà phần nội dung HOẶC phần nhãn (ví dụ: "A.", "B.", "C.", "D.") được gạch chân (thẻ <u>...</u>).
    2. Hình ảnh: Nếu một câu hỏi có chứa tag [IMAGE_REF_X] ngay trước hoặc sau nội dung câu hỏi, hãy trích xuất X vào trường "imageRefId".
    3. Trích xuất thông tin: 
       - "text": Nội dung văn bản của câu hỏi.
       - "options": Mảng các phương án trả lời (loại bỏ A, B, C, D ở đầu).
       - "correctAnswerIndex": Chỉ số của phương án đúng (0-indexed).
       - "imageRefId": (Tùy chọn) Số thứ tự X từ tag [IMAGE_REF_X] nếu câu hỏi có ảnh minh họa.
    4. Trả về mảng JSON.

    Dữ liệu HTML:
    ${htmlContent}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }
              },
              correctAnswerIndex: { type: Type.INTEGER },
              imageRefId: { type: Type.STRING, description: "ID của ảnh tham chiếu nếu có" }
            },
            required: ["id", "text", "options", "correctAnswerIndex"],
          },
        },
      },
    });

    // Fix: Using the .text property directly instead of calling a method, and handling potential undefined value
    const resultText = response.text || "[]";
    return JSON.parse(resultText.trim());
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    throw new Error("Không thể phân tích nội dung tệp. Vui lòng kiểm tra định dạng và thử lại.");
  }
};
