type Broswer = 'via' | 'alook' | 'x' | 'bz' | 'shark' | 'lit';

export interface Meta {
  version: string;
  id: string; // 唯一id，取文件名
  name: string;
  tags: string[];
  synopsis: string; // 简介
  match?: string[]; // 匹配网址
  detail: string; // 详情
  type: 'javascript'; // 类型
  source: string; // 源代码
  build: string; // 产物
  // 编译选项
  options?: {};
}

export interface MetaVersion {
  hash: string;
  date: number;
  message: string;
  author_name: string;
  author_email: string;
  version: string;
}

export interface MetaIndex {
  hash: string;
  versions: MetaVersion[];
  meta?: Meta;
}
