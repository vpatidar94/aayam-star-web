import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AyDataTableComponent } from "./ay-data-table.component";

describe("AyDataTableComponent", () => {
  let component: AyDataTableComponent;
  let fixture: ComponentFixture<AyDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AyDataTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AyDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
