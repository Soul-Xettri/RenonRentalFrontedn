import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchDataService {
  private searchDataSubject = new BehaviorSubject<any>(null);
  searchData$ = this.searchDataSubject.asObservable();

  updateSearchData(data: any) {
    this.searchDataSubject.next(data);
    // Optionally store in localStorage for additional persistence
    localStorage.setItem('searchData', JSON.stringify(data));
  }

  getStoredSearchData() {
    const storedData = localStorage.getItem('searchData');
    return storedData ? JSON.parse(storedData) : null;
  }

  clearSearchData() {
    this.searchDataSubject.next(null);
    localStorage.removeItem('searchData');
  }
}