import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MarkdownEditor } from "../MarkdownEditor";

describe("MarkdownEditor Component", () => {
  it("should render editor toolbar, textarea, and word count", () => {
    const onChange = vi.fn();
    render(
      <MarkdownEditor
        value="# Tiêu đề bài viết\nNội dung bài viết mẫu."
        onChange={onChange}
      />
    );

    expect(
      screen.getByPlaceholderText(/Nhập nội dung bài viết theo định dạng Markdown/i)
    ).toBeInTheDocument();
    expect(screen.getByTitle(/In đậm/i)).toBeInTheDocument();
    expect(screen.getByTitle(/In nghiêng/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Tiêu đề H1/i)).toBeInTheDocument();
    expect(screen.getByText(/từ/i)).toBeInTheDocument();
  });

  it("should call onChange when user types in markdown textarea", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MarkdownEditor value="" onChange={onChange} />);

    const textarea = screen.getByPlaceholderText(/Nhập nội dung bài viết theo định dạng Markdown/i);
    await user.type(textarea, "Hello Markdown");

    expect(onChange).toHaveBeenCalled();
  });

  it("should insert markdown syntax when toolbar button is clicked", () => {
    const onChange = vi.fn();
    render(<MarkdownEditor value="" onChange={onChange} />);

    const boldBtn = screen.getByTitle(/In đậm/i);
    fireEvent.click(boldBtn);

    expect(onChange).toHaveBeenCalledWith("**in đậm**");
  });

  it("should toggle between split view, editor only, and preview only", () => {
    render(<MarkdownEditor value="## Sample Markdown" onChange={vi.fn()} />);

    // Click Preview Only ("Xem trước")
    const previewBtn = screen.getByRole("button", { name: /Xem trước/i });
    fireEvent.click(previewBtn);
    expect(
      screen.queryByPlaceholderText(/Nhập nội dung bài viết theo định dạng Markdown/i)
    ).not.toBeInTheDocument();

    // Click Editor Only ("Soạn thảo")
    const editorBtn = screen.getByRole("button", { name: /Soạn thảo/i });
    fireEvent.click(editorBtn);
    expect(
      screen.getByPlaceholderText(/Nhập nội dung bài viết theo định dạng Markdown/i)
    ).toBeInTheDocument();
  });
});
