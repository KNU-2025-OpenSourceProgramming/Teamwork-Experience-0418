import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

/**
 * 测试应用标题渲染
 * 验证"인식 결과"文本是否正确显示
 */
test('renders app header', () => {
  render(<App />);
  const headerElement = screen.getByText(/인식 결과/i);
  expect(headerElement).toBeInTheDocument();
});

/**
 * 测试录音按钮渲染
 * 验证开始和停止录音按钮是否正确显示
 */
test('renders recording buttons', () => {
  render(<App />);
  const startButton = screen.getByText(/녹음 시작/i);
  const stopButton = screen.getByText(/녹음 중지/i);
  expect(startButton).toBeInTheDocument();
  expect(stopButton).toBeInTheDocument();
});

/**
 * Test button state changes when recording starts
 */
test('start button becomes disabled when recording starts', () => {
  render(<App />);
  const startButton = screen.getByText(/녹음 시작/i);
  const stopButton = screen.getByText(/녹음 중지/i);
  
  // Initially start button should be enabled and stop button disabled
  expect(startButton).not.toBeDisabled();
  expect(stopButton).toBeDisabled();
  
  // Click start button
  fireEvent.click(startButton);
  
  // After clicking, start button should be disabled and stop button enabled
  expect(startButton).toBeDisabled();
  expect(stopButton).not.toBeDisabled();
});

/**
 * Test transcription updates when recording starts and stops
 */
test('transcriptions update when recording starts and stops', async () => {
  render(<App />);
  const startButton = screen.getByText(/녹음 시작/i);
  const stopButton = screen.getByText(/녹음 중지/i);
  
  // Start recording
  fireEvent.click(startButton);
  
  // Check if transcription was added
  expect(screen.getByText(/녹음이 시작되었습니다./i)).toBeInTheDocument();
  
  // Stop recording
  fireEvent.click(stopButton);
  
  // Check if another transcription was added
  expect(screen.getByText(/녹음이 중지되었습니다./i)).toBeInTheDocument();
});