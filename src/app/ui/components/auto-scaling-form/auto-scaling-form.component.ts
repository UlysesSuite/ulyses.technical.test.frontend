import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-auto-scaling-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auto-scaling-form.component.html',
  styleUrl: './auto-scaling-form.component.scss'
})
export class AutoScalingFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  
  policyForm!: FormGroup;
  estimatedCost = 0;

  instanceTypes = [
    { id: 't3.micro', name: 't3.micro', price: 10 },
    { id: 't3.medium', name: 't3.medium', price: 40 },
    { id: 'm5.large', name: 'm5.large', price: 120 },
    { id: 'c5.xlarge', name: 'c5.xlarge', price: 250 }
  ];

  ngOnInit(): void {
    this.policyForm = this.fb.group({
      policyName: ['', Validators.required],
      instanceType: ['t3.micro', Validators.required],
      minInstances: [1, [Validators.required, Validators.min(1)]],
      maxInstances: [10, [Validators.required, Validators.max(100)]]
    });
  }

  onSubmit(): void {
    if (this.policyForm.valid) {
      console.log('Policy Created:', this.policyForm.value);
      alert('Policy saved successfully (check console)');
    }
  }
}
