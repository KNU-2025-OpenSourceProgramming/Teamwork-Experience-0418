import { render, screen } from '@testing-library/react';
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