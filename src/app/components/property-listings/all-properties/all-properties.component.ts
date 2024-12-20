import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { PropertyListing } from '../../../models/property.model';
import { PropertyService } from '../../../services/property.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-properties',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './all-properties.component.html',
  styleUrl: './all-properties.component.css'
})

export class AllPropertiesComponent implements OnInit {
  properties: PropertyListing[] = [];
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 2;
  filters: any = {
    Type: '',
    price: 0,
    nrOfBathrooms: 0,
    nrOfBedrooms: 0,
    status: '',
    squareFootage: 0,
  };

  constructor(private propertyService: PropertyService, private router: Router) {}

  ngOnInit(): void {
    // this.propertyService.getProperties().subscribe(
    //   (properties: PropertyListing[]) => {
    //     this.properties = properties;
    //   },
    //   (error) => {
    //     console.error('Error getting properties:', error);
    //   }
    // );
    this.fetchProperties();
  }

  fetchProperties() {
    const filters = {
      ...this.filters,
      Type: this.filters.Type?.toLowerCase(),
      status: this.filters.status?.toLowerCase(),
    };
    
  
    this.propertyService
      .getPaginatedProperties(this.currentPage, this.pageSize, filters)
      .subscribe(
        (response) => {
          console.log('API Response:', response); 
          if (response.isSuccess) {
            
            this.properties = response.data.data.map((property: PropertyListing) => ({
              ...property,
              type: property.type.toLowerCase() 
            }));
            this.totalPages = Math.ceil(response.data.totalCount / this.pageSize);
          } else {
            console.error('Error in API response:', response.errorMessage);
          }
          this.properties = response.data.data.filter((property: PropertyListing) => {
            console.log('Applying filters', this.filters); // Debug log
            return (
              (!filters.Type || property.type.toLowerCase() === filters.Type) &&
              (!filters.status || property.status.toLowerCase() === filters.status) &&
              (filters.price === 0 || property.price <= filters.price) &&
              (filters.nrOfBathrooms === 0 || property.numberOfBathrooms === filters.nrOfBathrooms) &&
              (filters.nrOfBedrooms === 0 || property.numberOfBedrooms === filters.nrOfBedrooms) &&
              (filters.squareFootage === 0 || property.squareFootage === filters.squareFootage)
            );
          });
          
        },
        (error) => {
          console.error('Error getting properties:', error);
        }
      );
    
      
  }
  
  clearFilters() {
    this.filters = {
      Type: '',
      price: 0,
      nrOfBathrooms: 0,
      nrOfBedrooms: 0,
      status: '',
      squareFootage: 0,
    };
    this.fetchProperties(); 
  }
  
  goToPage(page: number): void {
    this.currentPage = page;
    this.fetchProperties();
  }

  navigateToCreate() {
    this.router.navigate(['property-listings/create-property']);
  }

  navigateToDelete() {
    this.router.navigate(['property-listings/delete-property']);
  }
  navigateToGetById() {
    this.router.navigate(['property-listings/get-by-id']);
  }  

  navigateToUpdate() {
    this.router.navigate(['property-listings/update-property']);
  }
}
