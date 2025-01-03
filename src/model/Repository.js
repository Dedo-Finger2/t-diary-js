import { MethodNotImplemented } from "../errors/MethodNotImplemented";

export class Repository {
  constructor() {}

  async getTodayDiary() {
    throw new MethodNotImplemented();
  }

  async getDiaryByFilePath(filePath) {
    throw new MethodNotImplemented();
  }

  async createTodayDiary() {
    throw new MethodNotImplemented();
  }

  async updateDiary(filePath, sha, newContent) {
    throw new MethodNotImplemented();
  }

  async getAllDiaries() {
    throw new MethodNotImplemented();
  }

  async deleteDiary(filePath, sha) {
    throw new MethodNotImplemented();
  }
}
